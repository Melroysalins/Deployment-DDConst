import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function useAuthentication() {
  const [user, setuser] = useState(null);
  const [userLoading, setuserLoading] = useState(true);
  const [event, setevent] = useState(null);
  const navigate = useNavigate();

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) setevent('SIGNED_OUT');
    else setevent('SIGNED_IN');
    setuser(session?.user);
    setuserLoading(false);
    return session?.user;
  };

  const handleSession = async () => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setevent(event);
      setuser(session?.user);
    });
    return () => {
      authListener.unsubscribe();
    };
  };

  useEffect(() => {
    getSession();
    handleSession();
    return () => null;
  }, []);

  useEffect(() => {
    console.log(event);
    switch (event) {
      // case 'SIGNED_IN':
      //   navigate('/dashboard/projects/list', { replace: true });
      //   break;
      case 'SIGNED_OUT':
        navigate('/login', { replace: true });
        break;
      default:
    }
    return () => null;
  }, [event]);

  return {
    getSession,
    user,
    userLoading,
  };
}
