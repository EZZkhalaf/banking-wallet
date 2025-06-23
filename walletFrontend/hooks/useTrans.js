    import { View, Text, Alert } from 'react-native'
    import React, { useCallback, useState } from 'react'


    export const useTrans = (userId) => {
        const api_url = "http://192.168.1.11:5001/api";
        const [trans , setTrans] = useState([]);
        const [summary , setSummary] = useState({
            balance : 0,
            income : 0,
            expenses : 0 
        })
        const [isLoading , setIsLoading] = useState(false);


        const fetchTrans = useCallback(async()=>{
            try{
                console.log(`fetching from : ${api_url}/trans/${userId}`)
                const response = await fetch(`${api_url}/trans/${userId}`)

                const data = await response.json();
                
                setTrans(data)
            }catch(err){
                console.log("error fetching the transaction : " , err)
            }
        },[userId])

        const fetchSummary = useCallback(async()=>{
            try{
                const response = await fetch(`${api_url}/trans/summary/${userId}`)

                const data = await response.json();
                setSummary(data)
            }catch(err){
                console.log("error fetching the summary : " , err)
            }
        },[userId])

        const loadData = useCallback(async()=>{
            if(!userId) return 
            setIsLoading(true)
            try {
                await Promise.all([fetchTrans(),fetchSummary()])
            } catch (error) {   
                console.log("error loading the data : " , error)
            }finally{
                setIsLoading(false)
            }
        },[fetchTrans , fetchSummary,userId]);

        const deleteTrans = async(id) =>{
            try {
                const response = await fetch(`${api_url}/trans/${id}` , {
                    method:"delete"
                })
                if(!response.ok){
                    throw new Error("failed to delete transaction")
                }
                loadData();
                Alert.alert("Success" , "deleted successfully");
            } catch (error) {
                console.log("error deleting transaction : ",error )
                Alert.alert("Error" , error.message)
            }
        }

        return {trans , summary , isLoading , loadData , deleteTrans}
    }

