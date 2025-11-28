import * as React from "react"
import { Calendar, CalendarIcon } from "lucide-react"
import { Button } from "./button"
import { Calendar as CalendarComponent } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Input } from "./input"
import { cn } from "@/lib/utils"

const DatePicker = React.forwardRef(({ className, placeholder = "Pick a date", ...props }, ref) => {
  const [date, setDate] = React.useState(props.value || null)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setIsOpen(false)

    if (props.onChange) {
      props.onChange(selectedDate)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    if (!value) {
      setDate(null)
      if (props.onChange) {
        props.onChange(null)
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={formatDate(date)}
            onChange={handleInputChange}
            readOnly
            className={cn(
              "pr-10 cursor-pointer border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50",
              className
            )}
            {...props}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CalendarIcon className="h-4 w-4 text-blue-500/60" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border-0 shadow-lg"
        />
      </PopoverContent>
    </Popover>
  )
})

DatePicker.displayName = "DatePicker"

export { DatePicker }