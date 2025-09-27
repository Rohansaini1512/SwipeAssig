import React, { useState } from 'react';
import { Card, Steps, Button, message } from 'antd';
import { UserOutlined, FileTextOutlined, MessageOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addCandidate, startInterview, setCurrentCandidate } from '../store/slices/interviewSlice';
import { generateQuestions } from '../services/aiService';
import ResumeUpload from './ResumeUpload';
import InterviewChat from './InterviewChat';
import { Candidate } from '../types';

const { Step } = Steps;

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, isInterviewActive } = useSelector((state: RootState) => state.interview);
  const [currentStep, setCurrentStep] = useState(0);

  const handleCandidateCreated = (candidate: Candidate) => {
    dispatch(addCandidate(candidate));
    dispatch(setCurrentCandidate(candidate));
    setCurrentStep(1);
  };

  const handleStartInterview = () => {
    if (!currentCandidate) return;
    
    const questions = generateQuestions();
    dispatch(startInterview({ candidateId: currentCandidate.id, questions }));
    setCurrentStep(2);
    message.success('Interview started! Good luck!');
  };

  const handleRestart = () => {
    setCurrentStep(0);
    dispatch(setCurrentCandidate(undefined));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ResumeUpload onCandidateCreated={handleCandidateCreated} />;
      case 1:
        return (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h2>Profile Created Successfully!</h2>
              <p>Name: {currentCandidate?.name}</p>
              <p>Email: {currentCandidate?.email}</p>
              <p>Phone: {currentCandidate?.phone}</p>
              <Button type="primary" size="large" onClick={handleStartInterview}>
                Start Interview
              </Button>
            </div>
          </Card>
        );
      case 2:
        return <InterviewChat />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Steps current={currentStep}>
          <Step title="Upload Resume" icon={<FileTextOutlined />} />
          <Step title="Review Profile" icon={<UserOutlined />} />
          <Step title="Interview" icon={<MessageOutlined />} />
        </Steps>
      </Card>

      {renderStepContent()}

      {currentStep > 0 && !isInterviewActive && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={handleRestart}>
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default IntervieweeTab;
