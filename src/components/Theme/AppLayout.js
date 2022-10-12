import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME, AUTHOR } from '../../constants/theme.constant';
import { UserContextProvider } from '../../context'
import AppSidebar from './AppSidebar';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

const AppLayout = () => {

  return (
    <UserContextProvider>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <AppSidebar />
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
            }}
          />
          <Content
            style={{
              margin: '16px 16px',
            }}
          >
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            {APP_NAME} ©{new Date().getFullYear()} created by {AUTHOR}
          </Footer>
        </Layout>
      </Layout>
    </UserContextProvider>
  );
};

export default AppLayout;