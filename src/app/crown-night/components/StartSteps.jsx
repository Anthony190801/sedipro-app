// src/app/crown-night/components/StartSteps.jsx
const StartSteps = ({ number, text }) => (
    <div className="flex flex-row items-center">
        <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-primary/10 border border-primary/20">
            <p className="font-bold text-[20px] text-primary">0{number}</p>
        </div>
        <p className="flex-1 ml-[30px] font-normal text-[18px] text-foreground/60 leading-[32px]">
            {text}
        </p>
    </div>
)

export default StartSteps