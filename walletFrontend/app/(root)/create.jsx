import { View, Text, Alert, TouchableOpacity, TextInput,  ActivityIndicatorBase, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { styles } from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];
const api_url = "http://192.168.1.11:5001/api";

const CreateScreen = () => {
    const router = useRouter();
    const {user} = useUser();
    
    const [title , setTitle] = useState("")
    const [amount , setAmount ] = useState("")
    const [selectedCategory , setSelectedCategory] = useState("")
    const [isExpense , setIsExpense]=useState(true)
    const [loading , setLoading]=useState(false)
    const amountInputRef = useRef(null);

    const handleCreate = async()=>{
        if(!title.trim()) return Alert.alert("Error" , "please enter the transaction title ");

        if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 ){
            Alert.alert("Error" , "please enter a valid amount");
            return 
        }

        if(!selectedCategory) return Alert.alert("Error" , "please select a category ")
        
        setLoading(true)
        try {
            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount))
                                               : Math.abs(parseFloat(amount))
            
            const response = await fetch(`${api_url}/trans/` , {
                method :"post" ,
                headers:{'Content-Type' : "application/json"},
                body: JSON.stringify({
                    user_id : user.id,
                    title,
                    amount : formattedAmount,
                    category : selectedCategory
                })
            });
            
            if(!response.ok) {
                console.log("error here ")
                const errorData = await response.json();
                throw new Error(errorData.error || "failed to create transaction ")
            }

            Alert.alert("Success" , "transaction created sccessfully")
            router.back();
        } catch (error) {
            Alert.alert("Error" , error.message || "failed to create transaction ")
        }finally{
            setLoading(false)
        }
            
    }


    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, loading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.saveButton}>{loading ? "Saving..." : "Save"}</Text>
          {!loading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>


    <View style={styles.card}>

        {/* expense selector */}
        <View style={styles.typeSelector }>
            {/* expense selector */}
            <TouchableOpacity
                style={[styles.typeButton , isExpense && styles.typeButtonActive]}
                onPress={()=> setIsExpense(true)}
            >
                <Ionicons 
                    name="arrow-down-circle"
                    size={22}
                    color={isExpense ? COLORS.white : COLORS.expense}
                    style={styles.typeIcon}
                />
                <Text style={[styles.typeButtonText , isExpense && styles.typeButtonTextActive]}>
                    Expense
                </Text>
            </TouchableOpacity>

        {/* income selector  */}
         
            <TouchableOpacity
                style={[styles.typeButton , !isExpense && styles.typeButtonActive]}
                onPress={()=> setIsExpense(false)}
            >
                <Ionicons 
                    name="arrow-up-circle"
                    size={22}
                    color={!isExpense ? COLORS.white : COLORS.income}
                    style={styles.typeIcon}
                />
                <Text style={[styles.typeButtonText , !isExpense && styles.typeButtonTextActive]}>
                    Income
                </Text>
            </TouchableOpacity>

        </View>
        
        {/* for the amount input  */}
        <View style = {styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
                ref={amountInputRef} // Add a ref to the TextInput
                style={styles.amountInput}
                placeholder='0.00'
                placeholderTextColor={COLORS.textLight}
                value={amount}
                onChangeText={setAmount}
                keyboardType='numeric'
            />
        </View>

        {/* input container  */}
        <View style={styles.inputContainer}>
            <Ionicons
                name="create-outline"
                size={22}
                color={COLORS.textLight}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                placeholder="Transaction Title"
                placeholderTextColor={COLORS.textLight}
                value={title} // Assuming 'title' is the state holding the input value
                onChangeText={setTitle}
            />
        </View>

        {/* categorieessss */}
        <View style={styles.categoryGrid}>
            {CATEGORIES.map(category=>(
                <TouchableOpacity
                key={category.id}
                style={[
                    styles.categoryButton,
                    selectedCategory === category.name && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
                >
                <Ionicons
                    name={category.icon}
                    size={20}
                    color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                    style={styles.categoryIcon}
                />
                <Text
                    style={[
                    styles.categoryButtonText,
                    selectedCategory === category.name && styles.categoryButtonTextActive,
                    ]}
                >
                    {category.name}
                </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>

    {loading && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary}/>
        </View>
    )}
    </View>    
    )
}

export default CreateScreen