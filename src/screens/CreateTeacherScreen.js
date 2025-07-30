import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  ActivityIndicator,
  HelperText
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import mockAPI from '../services/api';

const CreateTeacherScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    return usernameRegex.test(username) && username.length >= 3;
  };

  const handleSubmit = async () => {
    // Validações
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, digite o nome completo');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite o email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Erro', 'Por favor, digite o nome de usuário');
      return;
    }

    if (!validateUsername(username)) {
      Alert.alert(
        'Erro', 
        'Nome de usuário deve ter pelo menos 3 caracteres e conter apenas letras, números, pontos e sublinhados'
      );
      return;
    }

    try {
      setLoading(true);
      
      await mockAPI.createTeacher({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase()
      });

      Alert.alert(
        'Sucesso',
        'Professor cadastrado com sucesso!\n\nSenha padrão: 123456\nO professor pode alterar a senha após fazer login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o professor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (name || email || username) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem dados não salvos. Deseja descartar?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const generateUsername = () => {
    if (name.trim()) {
      const nameParts = name.trim().toLowerCase().split(' ');
      let generatedUsername = '';
      
      if (nameParts.length >= 2) {
        generatedUsername = nameParts[0] + '.' + nameParts[nameParts.length - 1];
      } else {
        generatedUsername = nameParts[0];
      }
      
      // Remove acentos e caracteres especiais
      generatedUsername = generatedUsername
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.]/g, '');
      
      setUsername(generatedUsername);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="account-plus" size={32} color="#6200ee" />
              <Title style={styles.cardTitle}>Cadastrar Professor</Title>
            </View>
            
            <TextInput
              label="Nome Completo *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: João Silva Santos"
              autoCapitalize="words"
            />

            <TextInput
              label="Email *"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: joao.silva@escola.edu.br"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <HelperText type={email && !validateEmail(email) ? "error" : "info"}>
              {email && !validateEmail(email) 
                ? "Email inválido" 
                : "O email será usado para fazer login no sistema"
              }
            </HelperText>

            <View style={styles.usernameContainer}>
              <TextInput
                label="Nome de Usuário *"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.usernameInput}
                placeholder="Ex: joao.silva"
                autoCapitalize="none"
                autoComplete="username"
              />
              <Button
                mode="outlined"
                onPress={generateUsername}
                style={styles.generateButton}
                compact
                disabled={!name.trim()}
              >
                Gerar
              </Button>
            </View>
            <HelperText type={username && !validateUsername(username) ? "error" : "info"}>
              {username && !validateUsername(username)
                ? "Mínimo 3 caracteres, apenas letras, números, pontos e sublinhados"
                : "Nome único para identificar o professor"
              }
            </HelperText>

            {/* Informações sobre a conta */}
            <Card style={styles.infoCard}>
              <Card.Content>
                <View style={styles.infoHeader}>
                  <MaterialCommunityIcons name="information" size={20} color="#2196f3" />
                  <Text style={styles.infoTitle}>Informações da Conta</Text>
                </View>
                <Text style={styles.infoText}>
                  • Senha padrão: <Text style={styles.password}>123456</Text>
                </Text>
                <Text style={styles.infoText}>
                  • O professor deve alterar a senha no primeiro login
                </Text>
                <Text style={styles.infoText}>
                  • Email e nome de usuário devem ser únicos
                </Text>
              </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={
                  loading || 
                  !name.trim() || 
                  !email.trim() || 
                  !username.trim() ||
                  !validateEmail(email) ||
                  !validateUsername(username)
                }
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  'Cadastrar Professor'
                )}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Preview Card */}
        {(name || email || username) && (
          <Card style={styles.previewCard}>
            <Card.Content>
              <View style={styles.previewHeader}>
                <MaterialCommunityIcons name="eye" size={20} color="#666" />
                <Text style={styles.previewTitle}>Pré-visualização</Text>
              </View>
              
              {name && (
                <Text style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Nome: </Text>
                  {name}
                </Text>
              )}
              
              {email && (
                <Text style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Email: </Text>
                  {email.toLowerCase()}
                </Text>
              )}
              
              {username && (
                <Text style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Usuário: </Text>
                  @{username.toLowerCase()}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  input: {
    marginBottom: 8,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  usernameInput: {
    flex: 1,
    marginRight: 8,
  },
  generateButton: {
    marginBottom: 8,
  },
  infoCard: {
    marginVertical: 16,
    backgroundColor: '#e3f2fd',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  password: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  previewCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor: '#f9f9f9',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  previewItem: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  previewLabel: {
    fontWeight: 'bold',
  },
});

export default CreateTeacherScreen;