import { Button, Form, Input, Modal } from "antd";
import { useQuery } from "react-query";
import { queryKeys } from "../../../services/queryKeys";
import { sectionsService } from "../../../services/sectionsService";

export interface INewSection {
  isModalOpened: boolean;
  cancel: () => void;
  submit: (sectionName: string) => void;
}

interface NewSectionFormData {
  sectionName: string;
}

export const NewSection: React.FC<INewSection> = ({
  isModalOpened,
  cancel,
  submit,
}) => {
  const { data: sections } = useQuery(queryKeys.sections, sectionsService.getSections);

  const onFinish = (data: NewSectionFormData) => {
    submit(data.sectionName);
  };

  if (!isModalOpened) return null;

  return (
    <Modal
      open={isModalOpened}
      title="Create new section"
      width={350}
      footer={null}
      maskClosable={false}
      onCancel={cancel}
    >
      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Section name"
          name="sectionName"
          rules={[
            { required: true, message: "Please input your section name!" },
            {
              validator: (_, value) => {
                if (
                  sections!.some(
                    (s) => s.name.toLowerCase() === value.toLowerCase()
                  )
                ) {
                  return Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
              message: "Section name must be unique",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" size="large" htmlType="submit">
              Save Section
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
