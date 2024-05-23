import {Kafka, Producer} from 'kafkajs'
import fs from 'fs'
import path from 'path'
import prismaClient from './prisma';

const kafka = new Kafka({
    brokers:["kafka-1211e35d-agnibharay-125c.d.aivencloud.com:28270"],
    ssl:{
        ca:[fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],    
    },
    sasl:{
        username:"avnadmin",
        password:"AVNS_MwNQU3TH8Xbq88PDrgc",
        mechanism:"plain",
    },
})

let producer:null | Producer =null;

export async function createProducer() {
    if(producer) return producer
    const _producer = kafka.producer();
    await _producer.connect();
    producer=_producer
    return producer;
}

export async function produceMessage(message:string) {
    const producer= await createProducer();
    await producer.send({
        messages:[{
            key:`message-${Date.now()}`,
            value:message
        }],
        topic:"MESSAGES"
    })

    return true;
}


export async function MsgConsumner() {
    const consumer= kafka.consumer({groupId:"default"})
    await consumer.connect()
    await consumer.subscribe({topic:"MESSAGES", fromBeginning:true})
    await consumer.run({
        autoCommit:true,
        eachMessage:async({message, pause})=>{
            if(!message.value) return;
            console.log("Consumer to Postgres", message.value?.toString())
            try {
                await prismaClient.message.create({
                    data:{
                        text:message.value?.toString(),
    
                    }
                })
            } catch (error) {
                console.log("Something Went Wrong Try Again");
                pause();
                setTimeout(()=>{
                    consumer.resume([{topic:"MESSAGES"}]);
                },60*1000);
            }
        }
    })
}
    




export default kafka;