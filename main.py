from kivy.app import App
from Screens.Login_Screen import LoginScreen  # import from your folder

class MyApp(App):
    def build(self):
        return LoginScreen()

if __name__ == '__main__':
    MyApp().run()