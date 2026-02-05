const Loader = ({
  variant = 'default',
  size = 32,
  color = 'primary',
}: {
  size?: number;
  color?: string;
  variant?: string;
}) => {
  return (
    <>
      <div
        className={`${
          variant === 'screen'
            ? 'min-h-screen flex justify-center items-center'
            : ''
        }`}
      >
        <div
          className={`w-${size} h-${size} border-3 border-${color} border-t-transparent rounded-full animate-spin`}
          style={{
            height: size,
            width: size,
          }}
        ></div>
      </div>
    </>
  );
};

export default Loader;
