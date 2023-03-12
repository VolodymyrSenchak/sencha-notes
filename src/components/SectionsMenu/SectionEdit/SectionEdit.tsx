import { Button, Form, Input, InputNumber, Modal } from "antd";
import { useSectionsData } from "../../../hooks/useSectionsData";
import { Section } from "../../../models";

export interface ISectionEdit {
  isModalOpened: boolean;
  section?: Section;
  onCloseModal: () => void;
}

interface SectionEditFormData {
  name: string;
  displayOrder?: number;
}

export const SectionEdit: React.FC<ISectionEdit> = ({
  section,
  isModalOpened,
  onCloseModal,
}) => {
  const { sections, editSectionMutator } = useSectionsData();

  const initialFormData: SectionEditFormData = {
    name: section?.name || "",
    displayOrder: section?.displayOrder,
  };

  const onFinish = async (data: SectionEditFormData) => {
    await editSectionMutator.mutateAsync({
      ...section!,
      name: data.name,
      displayOrder: data.displayOrder,
    });

    onCloseModal();
  };
 
  const onCancel = () => {
    onCloseModal();
  };

  if (!isModalOpened) return null;

  return (
    <Modal
      open={isModalOpened}
      title="Edit section"
      width={300}
      footer={null}
      maskClosable={false}
      onCancel={onCancel}
    >
      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={initialFormData}
      >
        <Form.Item
          label="Section name"
          name="name"
          rules={[
            { required: true, message: "Please input your section name!" },
            {
              validator: (_, value) => {
                if (
                  sections!.some(
                    (s) =>
                      s.name.toLowerCase() === value.toLowerCase() &&
                      s.id !== section!.id
                  )
                ) {
                  return Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
              message: "Section name already used",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Section Display Order" name="displayOrder">
          <InputNumber size="large"></InputNumber>
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
