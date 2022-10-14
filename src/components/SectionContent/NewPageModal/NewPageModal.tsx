import { Button, Form, Input, Modal } from "antd";

export interface INewPageModal {
  isModalOpened: boolean;
  existingPagesNames: string[];
  cancel: () => void;
  submit: (pageName: string) => void;
}

interface NewPageFormData {
  pageName: string;
}

export const NewPageModal: React.FC<INewPageModal> = ({
  isModalOpened,
  existingPagesNames,
  cancel,
  submit,
}) => {
  const onFinish = (data: NewPageFormData) => {
    submit(data.pageName);
  };

  if (!isModalOpened) return null;

  return (
    <Modal
      open={isModalOpened}
      title="Create new section page"
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
          label="Page name"
          name="pageName"
          rules={[
            { required: true, message: "Please input your section page name!" },
            {
              validator: (_, value) => {
                if (
                  existingPagesNames.some(
                    (s) => s.toLowerCase() === value.toLowerCase()
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
          <Input />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" htmlType="submit">
              Save Section Page
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
