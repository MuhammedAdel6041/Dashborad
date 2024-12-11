import { Form, Input, Button, message } from "antd";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post("https://e-commerce-api-v1-cdk5.onrender.com/api/v1/auths/signup", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        role: "admin",
      });

      message.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800">
      {/* Left Section */}
      <div className="lg:w-1/2 flex flex-col items-start justify-center px-12 text-gray-300 text-center lg:text-left">
        <h1 className="text-5xl font-bold mb-4">Create an Account</h1>
        <p className="text-lg">
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
        </p>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/3 bg-white rounded-3xl shadow-xl p-8 mx-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting, errors, touched }) => (
            <Form onFinish={handleSubmit} layout="vertical" className="space-y-4">
              <Form.Item
                label="Name"
                validateStatus={touched.name && errors.name ? "error" : ""}
                help={touched.name && errors.name ? errors.name : ""}
              >
                <Field
                  name="name"
                  as={Input}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email ? errors.email : ""}
              >
                <Field
                  name="email"
                  as={Input}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                validateStatus={touched.phone && errors.phone ? "error" : ""}
                help={touched.phone && errors.phone ? errors.phone : ""}
              >
                <Field
                  name="phone"
                  as={Input}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                validateStatus={touched.password && errors.password ? "error" : ""}
                help={touched.password && errors.password ? errors.password : ""}
              >
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                validateStatus={touched.passwordConfirm && errors.passwordConfirm ? "error" : ""}
                help={touched.passwordConfirm && errors.passwordConfirm ? errors.passwordConfirm : ""}
              >
                <Field
                  name="passwordConfirm"
                  as={Input.Password}
                  placeholder="Confirm your password"
                  className="w-full"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                loading={isSubmitting}
              >
                Create Account
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
