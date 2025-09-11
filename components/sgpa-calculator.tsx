"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Calculator } from "lucide-react"

interface Course {
  id: string
  name: string
  credits: number
  grade: string
}

interface GradePoint {
  [key: string]: number
}

const gradePoints: GradePoint = {
  "A+": 10,
  A: 9,
  "B+": 8,
  B: 7,
  "C+": 6,
  C: 5,
  D: 4,
  F: 0,
}

export function SGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([{ id: "1", name: "", credits: 0, grade: "" }])
  const [sgpa, setSgpa] = useState<number | null>(null)

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: "",
      credits: 0,
      grade: "",
    }
    setCourses([...courses, newCourse])
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id))
    }
  }

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, [field]: value } : course)))
  }

  const calculateSGPA = () => {
    const validCourses = courses.filter(
      (course) => course.name.trim() !== "" && course.credits > 0 && course.grade !== "",
    )

    if (validCourses.length === 0) {
      setSgpa(null)
      return
    }

    let totalCredits = 0
    let totalGradePoints = 0

    validCourses.forEach((course) => {
      const gradePoint = gradePoints[course.grade]
      totalCredits += course.credits
      totalGradePoints += gradePoint * course.credits
    })

    const calculatedSGPA = totalGradePoints / totalCredits
    setSgpa(Math.round(calculatedSGPA * 100) / 100)
  }

  const resetCalculator = () => {
    setCourses([{ id: "1", name: "", credits: 0, grade: "" }])
    setSgpa(null)
  }

  const getGradeDescription = (sgpa: number): string => {
    if (sgpa >= 9) return "Outstanding"
    if (sgpa >= 8) return "Excellent"
    if (sgpa >= 7) return "Very Good"
    if (sgpa >= 6) return "Good"
    if (sgpa >= 5) return "Average"
    if (sgpa >= 4) return "Below Average"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border rounded-lg bg-card"
            >
              <div className="space-y-2">
                <Label htmlFor={`course-name-${course.id}`}>Course Name</Label>
                <Input
                  id={`course-name-${course.id}`}
                  placeholder="e.g., Mathematics"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`credits-${course.id}`}>Credits</Label>
                <Input
                  id={`credits-${course.id}`}
                  type="number"
                  min="0"
                  max="10"
                  placeholder="3"
                  value={course.credits || ""}
                  onChange={(e) => updateCourse(course.id, "credits", Number.parseInt(e.target.value) || 0)}
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, "grade", value)}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(gradePoints).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({gradePoints[grade]} points)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                  className="h-10 w-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button variant="outline" onClick={addCourse} className="flex items-center gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={calculateSGPA} className="flex-1 bg-primary hover:bg-accent text-primary-foreground" size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate SGPA
        </Button>

        <Button variant="outline" onClick={resetCalculator} size="lg">
          Reset
        </Button>
      </div>

      {sgpa !== null && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-center text-primary">Your SGPA Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{sgpa.toFixed(2)}</div>
            <div className="text-xl text-muted-foreground">Grade: {getGradeDescription(sgpa)}</div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Your Semester Grade Point Average is calculated based on the credit hours and grades of your courses.
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Grading Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(gradePoints).map(([grade, points]) => (
              <div key={grade} className="flex justify-between items-center p-2 bg-background rounded border">
                <span className="font-medium">{grade}</span>
                <span className="text-muted-foreground">{points} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
