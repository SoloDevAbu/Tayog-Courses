import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'TEACHER' | 'STUDENT';
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: 'TEACHER' | 'STUDENT';
    }
}