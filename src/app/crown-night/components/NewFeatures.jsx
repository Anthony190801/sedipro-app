// src/app/crown-night/components/NewFeatures.jsx
const NewFeatures = ({ subtitle, orden }) => (
    <div className="flex-1 flex-col sm:max-w-[250px] min-w-[210px]">
        <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-primary/10 border border-primary/20">
            <p className="font-bold text-[20px] text-primary">{orden}</p>
        </div>
        <p className="flex-1 mt-[16px] font-normal text-[18px] text-foreground/60 leading-[32px]">
            {subtitle}
        </p>
    </div>
)

export default NewFeatures