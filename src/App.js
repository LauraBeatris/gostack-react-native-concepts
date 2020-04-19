import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";                

import api from './services/api'

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => { 
    api.get('repositories')
       .then(response => setRepositories(response.data))
       .catch(err => console.error(err))
  }, []);

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`repositories/${id}/like`);
      const updatedRepository = response.data; 

      setRepositories(repositories => repositories.map(repository => {
        if (repository.id === id) { 
          return {...repository, ...updatedRepository}
        } 

        return repository;
      }))
    } catch (err) { 
      Alert.alert('Erro', 'Não foi possivel adicionar um like no repositório, por favor, tente novamente.')
    }
  }

  async function handleAddRepository() { 
    try { 
      const response = await api.post('repositories', { 
        title: 'React Native Concepts',
        url: 'https://github.com/LauraBeatris/gostack-react-native-concepts',
        techs: ['JavaScript', 'React Native']
      });
      const repository = response.data; 
  
      setRepositories(repositories => [...repositories, repository]);
    } catch (err) { 
      Alert.alert('Erro', 'Não foi possivel adicionar o repositório, por favor, tente novamente.')
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          renderItem={({item}) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{item.title}</Text>

                <View style={styles.techsContainer}>
                  {item.techs.map(tech => (
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${item.id}`}
                  >
                    {item.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
          )}
          keyExtractor={repository => repository.id}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddRepository}>
          <Text style={styles.addButtonText}>Adicionar repositório</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#7159c1",
    padding: 15,
    textAlign: "center"
  },
});
