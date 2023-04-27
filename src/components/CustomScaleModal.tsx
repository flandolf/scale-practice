import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Tag,
} from "antd";
import scales from "../lib/scales.json";
type CustomScaleModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  customScales: string[];
  setCustomScales: (scales: string[]) => void;
};

const CustomScaleModal: React.FC<CustomScaleModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  customScales,
  setCustomScales,
}) => {
  const majors = Object.keys(scales).filter((scale) => scale.includes("major"));
  const minor = Object.keys(scales).filter((scale) => scale.includes("minor"));
  const [currentView, setCurrentView] = useState("major");

  return (
    <Modal
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => {
        setIsModalVisible(false);
      }}
      footer={
        <div>
          <Button
            type="primary"
            onClick={() => {
              setCustomScales([]);
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      }
    >
      <Layout style={{ background: "none" }}>
        <Typography.Title> Scale Select </Typography.Title>
        <Space direction="vertical">
          <Select
            defaultValue={"Major"}
            onChange={(v) => {
              setCurrentView(v);
            }}
            options={[
              { value: "major", label: "Major" },
              { value: "minor", label: "Minor" },
            ]}
          />
          <Row>
            <Col>
              {currentView === "major" &&
                majors.map((major) => (
                  <Checkbox
                    key={major}
                    checked={customScales.includes(major)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCustomScales([...customScales, major]);
                      } else {
                        setCustomScales(
                          customScales.filter((scale) => scale !== major)
                        );
                      }
                    }}
                  >
                    {major}
                  </Checkbox>
                ))}
            </Col>
          </Row>

          <Row>
            <Col>
              {currentView === "minor" &&
                minor.map((minor) => (
                  <Checkbox
                    key={minor}
                    checked={customScales.includes(minor)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCustomScales([...customScales, minor]);
                      } else {
                        setCustomScales(
                          customScales.filter((scale) => scale !== minor)
                        );
                      }
                    }}
                  >
                    {minor}
                  </Checkbox>
                ))}
            </Col>
          </Row>
        </Space>
        <Typography.Title level={3}>Custom Scales</Typography.Title>
        <Row>
          <Col>
            {customScales.map((scale) => (
              <Tag color="magenta">{scale}</Tag>
            ))}
          </Col>
        </Row>
      </Layout>
    </Modal>
  );
};

export default CustomScaleModal;
