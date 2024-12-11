/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/AddUserModal.js
import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select, Checkbox } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddUserModal = ({ visible, onClose, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);

  // Formik initial values and validation schema
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      role: "user",
      active: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter the user's name!"),
      email: Yup.string().email("Please enter a valid email!").required("Please enter the user's email!"),
      password: Yup.string().min(6, "Password must be at least 6 characters!").required("Please enter the password!"),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "The two passwords do not match!")
        .required("Please confirm the password!"),
      phone: Yup.string().required("Please enter the user's phone number!"),
      role: Yup.string().required("Please select the user's role!"),
      active: Yup.boolean().required("Please select the user's status!"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Make the API call to add the user
        await axios.post(
          "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users/",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("User added successfully!");
        onSuccess();
        onClose();
      } catch (error) {
        message.error("Failed to add user. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      title="Add User"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400} // Making the modal smaller
    >
      <Form onSubmitCapture={formik.handleSubmit} layout="vertical">
        <Form.Item
          label="Name"
          validateStatus={formik.touched.name && formik.errors.name ? "error" : ""}
          help={formik.touched.name && formik.errors.name}
        >
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={formik.touched.email && formik.errors.email ? "error" : ""}
          help={formik.touched.email && formik.errors.email}
        >
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={formik.touched.password && formik.errors.password ? "error" : ""}
          help={formik.touched.password && formik.errors.password}
        >
          <Input.Password
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          validateStatus={formik.touched.passwordConfirm && formik.errors.passwordConfirm ? "error" : ""}
          help={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
        >
          <Input.Password
            name="passwordConfirm"
            value={formik.values.passwordConfirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Phone"
          validateStatus={formik.touched.phone && formik.errors.phone ? "error" : ""}
          help={formik.touched.phone && formik.errors.phone}
        >
          <Input
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Role"
          validateStatus={formik.touched.role && formik.errors.role ? "error" : ""}
          help={formik.touched.role && formik.errors.role}
        >
          <Select
            name="role"
            value={formik.values.role}
            onChange={value => formik.setFieldValue("role", value)}
          >
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block disabled={formik.isSubmitting}>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
