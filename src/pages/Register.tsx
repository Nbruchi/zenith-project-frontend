
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-primary text-transparent bg-clip-text">Vehicle Parking Management System</h1>
        <p className="text-muted-foreground">Create a new account to get started</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
