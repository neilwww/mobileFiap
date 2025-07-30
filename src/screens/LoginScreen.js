import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type = 'teacher') => {
    if (type === 'teacher') {
      setEmail('carlos.silva@escola.edu.br');
      setPassword('123456');
    } else {
      setEmail('maria.santos@estudante.edu.br');
      setPassword('123456');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Blog Educacional</Title>
              <Paragraph style={styles.subtitle}>
                Faça login para acessar o conteúdo
              </Paragraph>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoComplete="password"
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : 'Entrar'}
              </Button>

              <View style={styles.demoButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => fillDemoCredentials('teacher')}
                  style={styles.demoButton}
                  icon="account-tie"
                  compact
                >
                  Login Professor
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => fillDemoCredentials('student')}
                  style={styles.demoButton}
                  icon="school"
                  compact
                >
                  Login Estudante
                </Button>
              </View>

              <View style={styles.credentialsInfo}>
                <Text style={styles.credentialsTitle}>
                  Credenciais de demonstração:
                </Text>
                <Text style={styles.credentialsSubtitle}>Professor (Admin):</Text>
                <Text style={styles.credentialsText}>
                  carlos.silva@escola.edu.br | senha: 123456
                </Text>
                <Text style={styles.credentialsSubtitle}>Estudante (Usuário):</Text>
                <Text style={styles.credentialsText}>
                  maria.santos@estudante.edu.br | senha: 123456
                </Text>
                <Text style={styles.note}>
                  * Professores têm acesso completo | Estudantes podem criar posts e comentar
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6200ee',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  credentialsInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  credentialsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  credentialsSubtitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#555',
    fontSize: 13,
  },
  credentialsText: {
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default LoginScreen;