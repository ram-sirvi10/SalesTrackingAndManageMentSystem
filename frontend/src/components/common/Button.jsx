const Button = ({ children, variant = "primary" }) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-700",
  };

  return <button className={`${base} ${styles[variant]}`}>{children}</button>;
};

export default Button;
