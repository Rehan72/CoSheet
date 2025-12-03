import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "@/lib/utils"

const Calendar = React.forwardRef(({ className, ...props }, ref) => {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(props.selected || null)

  const today = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Get last day of previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return

    const clickedDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(clickedDate)

    if (props.onSelect) {
      props.onSelect(clickedDate)
    }
  }

  const isToday = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false
    return today.getDate() === day &&
           today.getMonth() === currentMonth &&
           today.getFullYear() === currentYear
  }

  const isSelected = (day, isCurrentMonth) => {
    if (!isCurrentMonth || !selectedDate) return false
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear
  }

  // Generate calendar days
  const calendarDays = []

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: isToday(day, true),
      isSelected: isSelected(day, true)
    })
  }

  // Next month days to fill the grid
  const remainingCells = 42 - calendarDays.length // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  return (
    <div
      ref={ref}
      className={cn(
        "p-3 bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {/* Header with Month/Year Selection */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {/* Month Selection */}
          <Select
            value={monthNames[currentMonth]}
            onValueChange={(value) => {
              const monthIndex = monthNames.indexOf(value);
              setCurrentDate(new Date(currentYear, monthIndex, 1));
            }}
          >
            <SelectTrigger className="h-8 text-sm border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder={monthNames[currentMonth]} />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Selection */}
          <Select
            value={currentYear.toString()}
            onValueChange={(value) => {
              const year = parseInt(value);
              setCurrentDate(new Date(year, currentMonth, 1));
            }}
          >
            <SelectTrigger className="h-8 w-20 text-sm border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder={currentYear.toString()} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => {
                const year = currentYear - 5 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-blue-500/80"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            disabled={!dayInfo.isCurrentMonth}
            onClick={() => handleDateClick(dayInfo.day, dayInfo.isCurrentMonth)}
            className={cn(
              "h-8 w-8 p-0 text-sm font-medium transition-all duration-200",
              dayInfo.isCurrentMonth
                ? dayInfo.isSelected
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                  : dayInfo.isToday
                    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/50"
                    : "text-blue-600/80 dark:text-blue-400/80 hover:bg-blue-500/20"
                : "text-blue-400/40 dark:text-blue-500/40 cursor-not-allowed"
            )}
          >
            {dayInfo.day}
          </Button>
        ))}
      </div>

      {/* Footer with today button */}
      <div className="flex justify-center mt-4 pt-3 border-t border-blue-500/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentDate(today)
            setSelectedDate(today)
            if (props.onSelect) {
              props.onSelect(today)
            }
          }}
          className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
        >
          Today
        </Button>
      </div>
    </div>
  )
})

Calendar.displayName = "Calendar"

export { Calendar }