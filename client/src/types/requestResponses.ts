export type PostRequestResponse = {
  error?: string
  message: string
  resource: any
}

export type ValidationErrorObject = {
  parameter: string
  validationType: string
  message: string
  givenValue?: any
  expectedValue?: any
  givenType?: any
  expectedType?: any
}

export type ErrorResponse = {
  error: string
  validationErrorObject?: ValidationErrorObject
  message: string
}