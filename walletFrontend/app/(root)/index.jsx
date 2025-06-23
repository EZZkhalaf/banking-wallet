import {  useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, View, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { SignOutButton } from '@/components/SignOutButton';
import { useTrans } from "../../hooks/useTrans";
import { useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import { styles } from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { BalanceCard } from '../../components/BalanceCard';
import { TransItem } from '../../components/TransItem';
import NoTransFound from '../../components/NoTransFound';

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [refreshing,setRefreshing ] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/sign-in');
    }
  }, [isLoaded, user]);

  
  if (!isLoaded) return <PageLoader />;
  if (!user) return null;

  // Now guaranteed user is defined; call useTrans
  const { trans, summary, isLoading, loadData, deleteTrans } = useTrans(user.id);

  
  const onRefresh = async()=>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false)
  }

  useEffect(() => {
    loadData();
  }, [loadData]);

    const handleDelete =  (id) => {
    try {
        Alert.alert("Delete transaction" , "are you sure you want to delete this transaction?" ,[
            {text:"Cancel" , style:"cancel"},
            {text:"Delete" , style:"destructive" , onPress:()=>deleteTrans(id)}
        ])
    } catch (err) {

    }
  }

  if (isLoading && !refreshing) return <PageLoader />;



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/homeCat.jpeg')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>welcome ,</Text>
              <Text style={styles.usernameText}>
                {user.emailAddresses[0].emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/create')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>last transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={trans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing= {refreshing} onRefresh={onRefresh}/>}
      />
    </View>
  );
}
