"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const { language } = useLanguage()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  // Content based on selected language
  const content = {
    title: {
      en: "Contact Us",
      ru: "Свяжитесь с нами",
      uz: "Biz bilan bog'laning",
    },
    subtitle: {
      en: "We'd love to hear from you",
      ru: "Мы будем рады услышать от вас",
      uz: "Sizdan eshitishni xohlaymiz",
    },
    info: {
      address: {
        title: {
          en: "Visit Us",
          ru: "Посетите нас",
          uz: "Bizni tashrif buyuring",
        },
        content: {
          en: "15 Navoi Street, Tashkent, Uzbekistan",
          ru: "ул. Навои 15, Ташкент, Узбекистан",
          uz: "Navoiy ko'chasi 15, Toshkent, O'zbekiston",
        },
      },
      phone: {
        title: {
          en: "Call Us",
          ru: "Позвоните нам",
          uz: "Bizga qo'ng'iroq qiling",
        },
        content: "+998 71 123 4567",
      },
      email: {
        title: {
          en: "Email Us",
          ru: "Напишите нам",
          uz: "Bizga xat yozing",
        },
        content: "info@mobilehub.uz",
      },
      hours: {
        title: {
          en: "Business Hours",
          ru: "Часы работы",
          uz: "Ish soatlari",
        },
        content: {
          en: "Monday - Sunday: 10:00 - 22:00",
          ru: "Понедельник - Воскресенье: 10:00 - 22:00",
          uz: "Dushanba - Yakshanba: 10:00 - 22:00",
        },
      },
    },
    form: {
      title: {
        en: "Send us a message",
        ru: "Отправьте нам сообщение",
        uz: "Bizga xabar yuboring",
      },
      name: {
        label: {
          en: "Your Name",
          ru: "Ваше имя",
          uz: "Ismingiz",
        },
        placeholder: {
          en: "Enter your name",
          ru: "Введите ваше имя",
          uz: "Ismingizni kiriting",
        },
      },
      email: {
        label: {
          en: "Email Address",
          ru: "Адрес электронной почты",
          uz: "Elektron pochta manzili",
        },
        placeholder: {
          en: "Enter your email",
          ru: "Введите ваш email",
          uz: "Elektron pochtangizni kiriting",
        },
      },
      phone: {
        label: {
          en: "Phone Number",
          ru: "Номер телефона",
          uz: "Telefon raqami",
        },
        placeholder: {
          en: "Enter your phone number",
          ru: "Введите ваш номер телефона",
          uz: "Telefon raqamingizni kiriting",
        },
      },
      subject: {
        label: {
          en: "Subject",
          ru: "Тема",
          uz: "Mavzu",
        },
        placeholder: {
          en: "Enter subject",
          ru: "Введите тему",
          uz: "Mavzuni kiriting",
        },
      },
      message: {
        label: {
          en: "Message",
          ru: "Сообщение",
          uz: "Xabar",
        },
        placeholder: {
          en: "Enter your message",
          ru: "Введите ваше сообщение",
          uz: "Xabaringizni kiriting",
        },
      },
      submit: {
        en: "Send Message",
        ru: "Отправить сообщение",
        uz: "Xabar yuborish",
      },
      success: {
        en: "Your message has been sent successfully. We'll get back to you soon!",
        ru: "Ваше сообщение успешно отправлено. Мы скоро свяжемся с вами!",
        uz: "Xabaringiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz!",
      },
    },
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send the form data to your backend
    console.log("Form submitted:", formData)
    // Show success message
    setFormSubmitted(true)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    // Hide success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
    }, 5000)
  }

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center mb-12"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{content.title[language]}</h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">{content.subtitle[language]}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{content.info.address.title[language]}</h3>
              </div>
              <p className="text-muted-foreground pl-12">{content.info.address.content[language]}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{content.info.phone.title[language]}</h3>
              </div>
              <p className="text-muted-foreground pl-12">{content.info.phone.content}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{content.info.email.title[language]}</h3>
              </div>
              <p className="text-muted-foreground pl-12">{content.info.email.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{content.info.hours.title[language]}</h3>
                </div>
                <p className="text-muted-foreground pl-12">{content.info.hours.content[language]}</p>
              </CardContent>
            </Card>
          </div>

          <div className="aspect-square w-full h-auto rounded-lg overflow-hidden">
            <img
              src="/contact.png"
              alt="Store location"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">{content.form.title[language]}</h2>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                >
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <p className="text-green-700">{content.form.success[language]}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        {content.form.name.label[language]}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder={content.form.name.placeholder[language]}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        {content.form.email.label[language]}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={content.form.email.placeholder[language]}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        {content.form.phone.label[language]}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder={content.form.phone.placeholder[language]}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        {content.form.subject.label[language]}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={content.form.subject.placeholder[language]}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      {content.form.message.label[language]}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={content.form.message.placeholder[language]}
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {content.form.submit[language]}
                    </Button>
                  </motion.div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
