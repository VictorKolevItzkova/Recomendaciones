import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'

const InputField = (
    {
        label,
        value,
        type = "text",
        onChange,
        showPasswordToggle = false }
) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div>
            <p className="mb-2 font-bold">{label}</p>
            <div className="relative">
                <input
                    className="w-full p-3 border border-cyan-100 rounded-md pr-10"
                    type={showPasswordToggle && showPassword ? "text" : type}
                    value={value}
                    onChange={onChange}
                />
                {
                    showPasswordToggle && (
                        showPassword ? (
                            <Eye
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        ) : (
                            <EyeClosed
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        )
                    )
                }

            </div>
        </div>
    )
}

export default InputField;