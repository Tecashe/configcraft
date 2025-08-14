import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ConfigCraft
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Welcome back</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Sign in to your account to continue</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-2xl font-bold text-slate-900 dark:text-slate-100",
                headerSubtitle: "text-slate-600 dark:text-slate-400",
                socialButtonsBlockButton:
                  "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-200",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-slate-300 dark:bg-slate-600",
                dividerText: "text-slate-500 dark:text-slate-400",
                formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                formFieldInput:
                  "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                identityPreviewText: "text-slate-600 dark:text-slate-400",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                formResendCodeLink: "text-blue-600 hover:text-blue-700",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
