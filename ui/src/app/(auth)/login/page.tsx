const page = () => {
  return (
    <div className='flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-[#f6f7f8]'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center lg:text-left'>
          <div className='lg:hidden flex justify-center mb-6'>
            <div className='flex items-center gap-2 text-primary'>
              <span className='material-symbols-outlined text-4xl'>
                water_drop
              </span>
              <span className='text-2xl font-bold text-slate-90'>
                DairyFlow
              </span>
            </div>
          </div>
          <h2 className='text-3xl font-bold tracking-tight text-slate-900'>
            Welcome back
          </h2>
          <p className='mt-2 text-slate-600'>
            Please enter your details to sign in.
          </p>
        </div>
        <div className='mt-8'>
          <div className='flex h-12 items-center justify-center rounded-xl bg-slate-200 p-1 mb-8'>
            <label className='flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-checked:bg-white has-checked:shadow-sm has-checked:text-primary text-slate-600 text-sm font-semibold transition-all'>
              <span className='truncate'>Customer</span>
              <input
                className='invisible w-0'
                name='user-type'
                type='radio'
                value='Customer'
                // checked
              />
            </label>
            <label className='flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-checked:bg-white has-checked:shadow-sm has-checked:text-primary text-slate-600 text-sm font-semibold transition-all'>
              <span className='truncate'>Owner</span>
              <input
                className='invisible w-0'
                name='user-type'
                type='radio'
                value='Owner'
              />
            </label>
          </div>
          <form action='#' className='space-y-5' method='POST'>
            <div className='flex flex-col gap-2'>
              <label className='text-slate-700 text-sm font-semibold'>
                Email or Phone Number
              </label>
              <input
                className='form-input block w-full rounded-xl border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-primary h-14 px-4 placeholder:text-slate-400 transition-all'
                placeholder='name@example.com'
                type='text'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-slate-700text-sm font-semibold'>
                Password
              </label>
              <div className='relative flex w-full items-stretch'>
                <input
                  className='form-input block w-full rounded-xl border-slate-300 bg-white text-slate-90 focus:border-primary focus:ring-primary h-14 pl-4 pr-12 placeholder:text-slate-400 transition-all'
                  placeholder='••••••••'
                  type='password'
                />
                <div className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-primary'>
                  <span className='material-symbols-outlined'>visibility</span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary'
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                />
                <label
                  className='ml-2 block text-sm text-slate-700'
                  htmlFor='remember-me'
                >
                  Remember me
                </label>
              </div>
              <div className='text-sm'>
                <a
                  className='font-semibold text-primary hover:underline'
                  href='#'
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <button
              className='flex w-full items-center justify-center rounded-xl bg-primary h-14 px-4 text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              type='submit'
            >
              Sign In
            </button>
          </form>

          <p className='mt-10 text-center text-sm text-slate-600'>
            {` Don't have an account?`}
            <a className='font-bold text-primary hover:underline' href='#'>
              Sign up for free
            </a>
          </p>
        </div>
      </div>
      <footer className='mt-6'>
        <div className='flex gap-6 text-xs text-slate-400'>
          <a className='hover:text-primary transition-colors' href='#'>
            Terms of Service
          </a>
          <a className='hover:text-primary transition-colors' href='#'>
            Privacy Policy
          </a>
          <a className='hover:text-primary transition-colors' href='#'>
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default page;
