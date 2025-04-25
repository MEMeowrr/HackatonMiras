from kivy.app import App
from Screens.Login_Screen import LoginScreen  # import from your folder
import Functions.sqlConnectionHelper

if Functions.sqlConnectionHelper.TestConnection():
      print("✅ MySQL is connected and ready!")
else:
    print("❌ MySQL connection failed.")

class MyApp(App):
    def build(self):
        return LoginScreen()

if __name__ == '__main__':
    MyApp().run()