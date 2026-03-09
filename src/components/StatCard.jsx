export default function StatCard({ label, value, sub, valueColor }) {
  return (
    <div className="bg-[#0c1829] rounded-xl p-5
                    border border-[rgba(0,229,255,0.08)]">

      <p className="font-['JetBrains_Mono'] text-[10px]
                    text-[#8899b0] tracking-[0.5px] mb-3">
        {label}
      </p>

      <p className={`font-['Syne'] text-3xl font-bold ${valueColor}`}>
        {value}
      </p>

      {sub && (
        <p className="text-[11px] text-[#8899b0] mt-1">
          {sub}
        </p>
      )}

    </div>
  )
}