import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import AdminScreen from '../screens/AdminScreen';
import TeacherListScreen from '../screens/TeacherListScreen';
import CreateTeacherScreen from '../screens/CreateTeacherScreen';
import EditTeacherScreen from '../screens/EditTeacherScreen';
import StudentListScreen from '../screens/StudentListScreen';
import CreateStudentScreen from '../screens/CreateStudentScreen';
import EditStudentScreen from '../screens/EditStudentScreen';

// Context
import { AuthProvider, useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigators for each tab
const PostsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PostList" 
      component={PostListScreen} 
      options={{ title: 'Posts do Blog' }}
    />
    <Stack.Screen 
      name="PostDetail" 
      component={PostDetailScreen} 
      options={{ title: 'Detalhes do Post' }}
    />
  </Stack.Navigator>
);

const AdminStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AdminPanel" 
      component={AdminScreen} 
      options={{ title: 'Painel Administrativo' }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen} 
      options={{ title: 'Criar Post' }}
    />
    <Stack.Screen 
      name="EditPost" 
      component={EditPostScreen} 
      options={{ title: 'Editar Post' }}
    />
  </Stack.Navigator>
);

const TeachersStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TeacherList" 
      component={TeacherListScreen} 
      options={{ title: 'Professores' }}
    />
    <Stack.Screen 
      name="CreateTeacher" 
      component={CreateTeacherScreen} 
      options={{ title: 'Cadastrar Professor' }}
    />
    <Stack.Screen 
      name="EditTeacher" 
      component={EditTeacherScreen} 
      options={{ title: 'Editar Professor' }}
    />
  </Stack.Navigator>
);

const StudentsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="StudentList" 
      component={StudentListScreen} 
      options={{ title: 'Estudantes' }}
    />
    <Stack.Screen 
      name="CreateStudent" 
      component={CreateStudentScreen} 
      options={{ title: 'Cadastrar Estudante' }}
    />
    <Stack.Screen 
      name="EditStudent" 
      component={EditStudentScreen} 
      options={{ title: 'Editar Estudante' }}
    />
  </Stack.Navigator>
);

// Student Stack Navigator (for create post functionality)
const StudentStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="CreatePostStudent" 
      component={CreatePostScreen} 
      options={{ title: 'Criar Post' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator (only for authenticated users)
const MainTabNavigator = () => {
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Posts') {
            iconName = focused ? 'post' : 'post-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Professores') {
            iconName = focused ? 'account-tie' : 'account-tie-outline';
          } else if (route.name === 'Estudantes') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Criar Post') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Posts" component={PostsStackNavigator} />
      
      {user?.role === 'docente' ? (
        // Professor tabs - full admin access
        <>
          <Tab.Screen name="Admin" component={AdminStackNavigator} />
          <Tab.Screen name="Professores" component={TeachersStackNavigator} />
          <Tab.Screen name="Estudantes" component={StudentsStackNavigator} />
        </>
      ) : (
        // Student tabs - limited access, only create posts
        <Tab.Screen 
          name="Criar Post" 
          component={StudentStackNavigator}
          options={{ title: 'Criar Post' }}
        />
      )}
    </Tab.Navigator>
  );
};

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You could show a loading screen here
  }

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Root component with context providers
const AppWithProviders = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default AppWithProviders;