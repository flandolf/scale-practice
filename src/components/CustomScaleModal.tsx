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
import { get } from "@tonaljs/scale";
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
  const majors = get("C major")
    .notes.map((note) => `${note} major`)
    .sort();
  const minors = get("C minor")
    .notes.map((note) => `${note} minor`)
    .sort();
  const harmonic = get("C harmonic minor")
    .notes.map((note) => `${note} harmonic minor`)
    .sort();
  const melodic = get("C melodic minor")
    .notes.map((note) => `${note} melodic minor`)
    .sort();
  const blues = get("C blues")
    .notes.map((note) => `${note} blues`)
    .sort();
  const chromatic = get("C chromatic")
    .notes.map((note) => `${note} chromatic`)
    .sort();

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
        <Select
          defaultValue={"Major"}
          onChange={(v) => {
            setCurrentView(v);
          }}
          options={[
            { value: "major", label: "Major" },
            { value: "minor", label: "Minor" },
            { value: "harmonic", label: "Harmonic Minor" },
            { value: "melodic", label: "Melodic Minor" },
            { value: "blues", label: "Blues" },
            { value: "chromatic", label: "Chromatic" },
          ]}
        />
        <div style={{ height: "10px" }} />
        <Space>
          {[
            { scales: majors, view: "major" },
            { scales: minors, view: "minor" },
            { scales: harmonic, view: "harmonic" },
            { scales: melodic, view: "melodic" },
            { scales: blues, view: "blues" },
            { scales: chromatic, view: "chromatic" },
          ].map(({ scales, view }) => (
            <Row gutter={[4, 4]}>
              {currentView === view &&
                scales.map((scale) => (
                  <Col span={8}>
                    <Checkbox
                      checked={customScales.includes(scale)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCustomScales([...customScales, scale]);
                        } else {
                          setCustomScales(
                            customScales.filter((s) => s !== scale)
                          );
                        }
                      }}
                    >
                      {scale}
                    </Checkbox>
                  </Col>
                ))}
            </Row>
          ))}
        </Space>
        <Typography.Title level={3}>Selected Scales</Typography.Title>
        <Space direction="vertical">
          <Row gutter={[0, 4]}>
            {customScales.map((scale, i) => (
              <Col>
                <Tag
                  key={scale}
                  closable
                  color="magenta"
                  onClose={() => {
                    setCustomScales(customScales.filter((s) => s !== scale));
                  }}
                >
                  {scale}
                </Tag>
              </Col>
            ))}
          </Row>
        </Space>
      </Layout>
    </Modal>
  );
};

export default CustomScaleModal;
