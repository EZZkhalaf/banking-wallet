const express = require('express');
const {sql} = require('../config/db')

const getTransByUserId = async(req,res) =>{
    const {userId} = req.params;
    if(!userId){
        res.status(400).json({message: "fill the userId field"});
    }
    try {
        const response = await sql`
            select * 
            from trans
            where userId = ${userId}
            order by created_at desc
        `

        res.status(201).json(response);
    } catch (error) {
        console.log("error getting the user transactions : " , error)
        res.status(500).json({message : 'internal server error '})
    }
}


const deleteTransById =  async(req,res)=>{
    const {id} = req.params;
    try {
        const response = await sql`
            delete from trans 
            where id = ${id}
            returning *
            `
        if(response.length === 0) res.status(404).json({message : 'transaction not found...'});

        res.status(200).json({message : 'transaction deleted successfully'});
    } catch (error) {
        console.log("error deleting the transaction : " , error);
        res.status(500).json({message : 'internal server error'})      
    }
}


const addTrans = async(req,res)=>{
    //title,amount,category,user_id
    try {
        const {title,amount,category,user_id} = req.body
        if(!title || !amount || !category || !user_id){
        return res.status(400).json({message : "fill all the required fields"});
        }
        
        const trans = await sql`
            INSERT INTO trans(userId , title , amount , category)
                values(${user_id} , ${title} , ${amount} , ${category})
            returning *
        `;
        
        res.status(201).json(trans[0])

    } catch (error) {
        console.log("error creating the transaction....")
        res.status(500).json({message : "internal server error"})
    }
}

const getUserBalance = async(req,res) =>{
    const {userId} = req.params;
    try {
        //getting the balance 
        const response1  = await sql`
            select coalesce(sum(amount) , 0) as balance 
            from trans 
            where userId = ${userId}
            
            `;

        //getting the income value
        const response2 = await sql`
            select coalesce(sum(amount),0) as income 
            from trans
            where userId = ${userId}
            and amount > 0
            `;
        //getting the expenses 
        const response3 = await sql`
            select coalesce(sum(amount),0) as expenses 
            from trans
            where userId = ${userId}
            and amount > 0
            `

        res.status(200).json({
            balance : response1[0].balance,
            income : response2[0].income,
            expenses : response3[0].expenses
        })
    } catch (error) {
        console.log("error getting the summary of the user : " , error);
        res.status(500).json({message : 'internal server error '})
    }
}

module.exports = {getTransByUserId , deleteTransById , addTrans , getUserBalance};