import React, { useState, useEffect } from 'react';
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

const EditTeacherScreen = ({ route, navigation }) => {
  const { teacherId } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadTeacher();
  }, [teacherId]);

  const loadTeacher = async () => {
    try {
      setLoading(true);
      const teachers = await mockAPI.getTeachers();
      const teacher = teachers.find(t => t.id === teacherId);
      
      if (!teacher) {
        Alert.alert('Erro', 'Professor não encontrado');
        navigation.goBack();
        return;
      }
      
      setName(teacher.name);
      setEmail(teacher.email);
      setUsername(teacher.username);
      setOriginalData({
        name: teacher.name,
        email: teacher.email,
        username: teacher.username
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do professor');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    return usernameRegex.test(username) && username.length >= 3;
  };

  const hasChanges = () => {
    return (
      name.trim() !== originalData.name ||
      email.trim().toLowerCase() !== originalData.email ||
      username.trim().toLowerCase() !== originalData.username
    );
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

    if (!hasChanges()) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita');
      return;
    }

    try {
      setSaving(true);
      
      await mockAPI.updateTeacher(teacherId, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase()
      });

      Alert.alert(
        'Sucesso',
        'Professor atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o professor');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartar?',
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando dados do professor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="account-edit" size={32} color="#6200ee" />
              <Title style={styles.cardTitle}>Editar Professor</Title>
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

            {/* Informações sobre alterações */}
            {hasChanges() && (
              <Card style={styles.changesCard}>
                <Card.Content>
                  <View style={styles.changesHeader}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color="#ff9800" />
                    <Text style={styles.changesTitle}>Alterações Pendentes</Text>
                  </View>
                  <Text style={styles.changesText}>
                    Você tem alterações não salvas. Não esqueça de clicar em "Salvar Alterações".
                  </Text>
                </Card.Content>
              </Card>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                disabled={saving}
              >
                Cancelar
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={
                  saving || 
                  !name.trim() || 
                  !email.trim() || 
                  !username.trim() ||
                  !validateEmail(email) ||
                  !validateUsername(username) ||
                  !hasChanges()
                }
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Comparison Card */}
        {hasChanges() && (
          <Card style={styles.comparisonCard}>
            <Card.Content>
              <View style={styles.comparisonHeader}>
                <MaterialCommunityIcons name="compare" size={20} color="#666" />
                <Text style={styles.comparisonTitle}>Comparação</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonColumn}>
                  <Text style={styles.comparisonLabel}>Anterior</Text>
                  <Text style={styles.comparisonValue}>
                    {originalData.name}
                  </Text>
                  <Text style={styles.comparisonValue}>
                    {originalData.email}
                  </Text>
                  <Text style={styles.comparisonValue}>
                    @{originalData.username}
                  </Text>
                </View>
                
                <MaterialCommunityIcons 
                  name="arrow-right" 
                  size={24} 
                  color="#666" 
                  style={styles.arrow}
                />
                
                <View style={styles.comparisonColumn}>
                  <Text style={styles.comparisonLabel}>Novo</Text>
                  <Text style={[
                    styles.comparisonValue,
                    name.trim() !== originalData.name && styles.changedValue
                  ]}>
                    {name}
                  </Text>
                  <Text style={[
                    styles.comparisonValue,
                    email.trim().toLowerCase() !== originalData.email && styles.changedValue
                  ]}>
                    {email.toLowerCase()}
                  </Text>
                  <Text style={[
                    styles.comparisonValue,
                    username.trim().toLowerCase() !== originalData.username && styles.changedValue
                  ]}>
                    @{username.toLowerCase()}
                  </Text>
                </View>
              </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  changesCard: {
    marginVertical: 16,
    backgroundColor: '#fff3e0',
  },
  changesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  changesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#f57c00',
  },
  changesText: {
    fontSize: 14,
    color: '#333',
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
  comparisonCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor: '#f9f9f9',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  comparisonTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  comparisonValue: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  changedValue: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  arrow: {
    marginHorizontal: 16,
  },
});

export default EditTeacherScreen;