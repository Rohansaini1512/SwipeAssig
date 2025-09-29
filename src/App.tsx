import React, { useEffect } from 'react';
import { Layout, Tabs, Typography, Space } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setShowWelcomeBackModal, setActiveTab } from './store/slices/uiSlice';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import WelcomeBackModal from './components/WelcomeBackModal';
import ErrorBoundary from './components/ErrorBoundary';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const { currentCandidate } = useSelector((state: RootState) => state.interview);

  useEffect(() => {
    // Check for unfinished interview on app load
    if (currentCandidate && (currentCandidate.interviewStatus === 'paused' || currentCandidate.interviewStatus === 'in_progress')) {
      dispatch(setShowWelcomeBackModal(true));
    }
  }, [dispatch, currentCandidate]);

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <Space>
          <UserOutlined />
          Interviewee
        </Space>
      ),
      children: <IntervieweeTab />
    },
    {
      key: 'interviewer',
      label: (
        <Space>
          <DashboardOutlined />
          Interviewer
        </Space>
      ),
      children: <InterviewerTab />
    }
  ];

  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              AI Interview Assistant
            </Title>
          </div>
        </Header>
        
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Tabs
              activeKey={activeTab}
              items={tabItems}
              size="large"
              style={{ padding: '24px' }}
              onChange={(key) => {
                if (key === 'interviewee' || key === 'interviewer') {
                  dispatch(setActiveTab(key));
                }
              }}
            />
          </div>
          
          <WelcomeBackModal />
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
