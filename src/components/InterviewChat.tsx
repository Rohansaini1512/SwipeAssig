import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Progress, Typography, Space, message } from 'antd';
import { SendOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { submitAnswer, pauseInterview, resumeInterview, updateTimeRemaining, setFinalScore } from '../store/slices/interviewSlice';
import { evaluateAnswer, generateSummary } from '../services/aiService';

const { TextArea } = Input;
const { Title, Text } = Typography;

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentQuestion, timeRemaining, isPaused } = useSelector((state: RootState) => state.interview);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentQuestion || isPaused) return;

    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        dispatch(updateTimeRemaining(timeRemaining - 1));
      } else {
        handleSubmitAnswer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isPaused, currentQuestion]);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !currentCandidate) return;
    
    setIsSubmitting(true);
    try {
      const { score, feedback } = await evaluateAnswer(currentQuestion, currentAnswer);
      
      dispatch(submitAnswer({
        questionId: currentQuestion.id,
        answer: currentAnswer,
        timeSpent: currentQuestion.timeLimit - timeRemaining
      }));

      // If this is the last question, calculate final score and summary
      if (currentCandidate.currentQuestionIndex + 1 >= currentCandidate.questions.length) {
        const updatedAnswers = [...currentCandidate.answers, {
          questionId: currentQuestion.id,
          text: currentAnswer,
          score,
          feedback,
          timeSpent: currentQuestion.timeLimit - timeRemaining,
          submittedAt: new Date()
        }];
        
        const finalScore = Math.round(updatedAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0) / updatedAnswers.length);
        const summary = await generateSummary(currentCandidate, updatedAnswers);
        
        dispatch(setFinalScore({
          candidateId: currentCandidate.id,
          score: finalScore,
          summary
        }));
        
        message.success(`Interview completed! Final Score: ${finalScore}/10`);
      } else {
        message.success(`Answer submitted! Score: ${score}/10`);
      }
      
      setCurrentAnswer('');
    } catch (error) {
      message.error('Error submitting answer');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      dispatch(resumeInterview());
    } else {
      dispatch(pauseInterview());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentCandidate || !currentQuestion) {
    return (
      <Card>
        <Text>No active interview session.</Text>
      </Card>
    );
  }

  const progress = currentCandidate.currentQuestionIndex + 1;
  const totalQuestions = currentCandidate.questions.length;
  const progressPercent = (progress / totalQuestions) * 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Question {progress} of {totalQuestions}</Title>
            <Button 
              icon={isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
              onClick={handlePauseResume}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
          
          <Progress 
            percent={progressPercent} 
            status={timeRemaining < 10 ? 'exception' : 'active'}
            format={() => `${progress}/${totalQuestions}`}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Time Remaining: {formatTime(timeRemaining)}</Text>
            <Text type="secondary">Difficulty: {currentQuestion.difficulty.toUpperCase()}</Text>
          </div>
        </Space>
      </Card>

      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Space direction="vertical" style={{ width: '100%', height: '100%' }}>
          <div>
            <Title level={5}>Question:</Title>
            <Text>{currentQuestion.text}</Text>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Text strong>Your Answer:</Text>
            <TextArea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={isPaused || isSubmitting}
            />
          </div>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim() || isPaused || isSubmitting}
            loading={isSubmitting}
            block
          >
            Submit Answer
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default InterviewChat;
