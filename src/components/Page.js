import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef, useEffect, useState } from 'react';
// @mui
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => {
  const { t, i18n } = useTranslation(['common']);
  const [favicon, setFavicon] = useState(getFaviconByLanguage(i18n.language));

  // Function to get the favicon URL based on the language
  function getFaviconByLanguage(language) {
    const favicons = {
      en: '/static/favicon/favicon-32x32.png',
      ko: '/static/logos/gwalli_white.png',
      // Add more languages and their corresponding favicons
    };
    return favicons[language] || '/path/to/default-favicon.ico';
  }

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setFavicon(getFaviconByLanguage(lng));
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <>
      <Helmet>
        <title>{t('dd_const')}-{title}</title>
        {meta}
        {/* Dynamically update favicon */}
        <link rel="icon" type="image/png" sizes="16x16"  href={favicon} />
        <link rel="icon" type="image/png" sizes="32x32"  href={favicon} />
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
