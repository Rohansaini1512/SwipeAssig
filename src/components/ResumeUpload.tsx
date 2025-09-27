import React, { useState } from 'react';
import { Upload, Button, Form, Input, message, Card } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { extractFromPDF, extractFromDOCX } from '../services/resumeParser';
import { Candidate } from '../types';

interface ResumeUploadProps {
  onCandidateCreated: (candidate: Candidate) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onCandidateCreated }) => {
  const [form] = Form.useForm();
  const [extractedData, setExtractedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      let extracted;
      if (file.type === 'application/pdf') {
        extracted = await extractFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extracted = await extractFromDOCX(file);
      } else {
        message.error('Please upload a PDF or DOCX file');
        return false;
      }

      setExtractedData(extracted);
      form.setFieldsValue({
        name: extracted.name || '',
        email: extracted.email || '',
        phone: extracted.phone || ''
      });
      message.success('Resume processed successfully!');
    } catch (error) {
      message.error('Error processing resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
  };

  const handleSubmit = (values: any) => {
    const candidate: Candidate = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      resumeText: extractedData?.text,
      interviewStatus: 'not_started',
      currentQuestionIndex: 0,
      questions: [],
      answers: []
    };
    onCandidateCreated(candidate);
    message.success('Candidate profile created successfully!');
  };

  return (
    <Card title="Upload Resume" style={{ marginBottom: 24 }}>
      <Upload.Dragger
        name="resume"
        multiple={false}
        beforeUpload={handleFileUpload}
        accept=".pdf,.docx"
        showUploadList={false}
        disabled={loading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag resume file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF and DOCX files
        </p>
      </Upload.Dragger>

      {extractedData && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Profile
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ResumeUpload;
