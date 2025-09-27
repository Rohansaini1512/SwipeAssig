import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { resumeInterview } from '../store/slices/interviewSlice';
import { setShowWelcomeBackModal } from '../store/slices/uiSlice';

const { Title, Text } = Typography;

const WelcomeBackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showWelcomeBackModal } = useSelector((state: RootState) => state.ui);
  const { currentCandidate } = useSelector((state: RootState) => state.interview);

  const handleResume = () => {
    dispatch(resumeInterview());
    dispatch(setShowWelcomeBackModal(false));
  };

  const handleStartOver = () => {
    dispatch(setShowWelcomeBackModal(false));
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
          <span>Welcome Back!</span>
        </Space>
      }
      open={showWelcomeBackModal}
      onCancel={handleStartOver}
      footer={[
        <Button key="startOver" onClick={handleStartOver}>
          Start Over
        </Button>,
        <Button key="resume" type="primary" icon={<PlayCircleOutlined />} onClick={handleResume}>
          Resume Interview
        </Button>,
      ]}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={4}>You have an unfinished interview session</Title>
        <Text>
          {currentCandidate && (
            <>
              <p>Candidate: <strong>{currentCandidate.name}</strong></p>
              <p>Progress: {currentCandidate.currentQuestionIndex + 1} of {currentCandidate.questions.length} questions</p>
              <p>Status: {currentCandidate.interviewStatus.replace('_', ' ').toUpperCase()}</p>
            </>
          )}
        </Text>
        <br />
        <Text type="secondary">
          Would you like to resume where you left off or start a new interview?
        </Text>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;
