type Props = {
    white: boolean;
}

const Logo = ({white}:Props) => {
    let text = white ? "white" : "slate";
  return (
    <div className="flex items-center gap-2">
      <div className="text-rose-500">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </div>
      <div>
        <h2 className={`text-xl font-bold text-${text}-800 leading-tight`}>
          NutriControl
          <br />
          <span className={`text-${text}-600 font-medium`}>Familiar</span>
        </h2>
        <p className={`text-[10px] text-${text}-500 uppercase tracking-wide`}>
          Consulta médica virtual
        </p>
      </div>
    </div>
  );
};

export default Logo;
