import { Link, Outlet } from 'react-router-dom';
import './rootlayout.css'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

const RootLayout = ()=>{
    return (
        <QueryClientProvider client={queryClient}>
        <div className="RootLayout">
            <header>
                <Link to="/" className='logo'>
                    <img src="/logo.png" alt="" />
                    <span>RJ-AI</span>
                </Link>
                <div className="user">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
        </QueryClientProvider>
        
    )
}

export default RootLayout;