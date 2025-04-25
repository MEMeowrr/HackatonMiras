from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
#from Screens.Login_Screen import LoginScreen  # import from your folder
import Functions.sqlConnectionHelper

if Functions.sqlConnectionHelper.TestConnection():
      print("✅ MySQL is connected and ready!")
else:
    print("❌ MySQL connection failed.")

class MyApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical')
        self.label = Label(text="Press button to fetch points")
        btn = Button(text="Load Points")
        btn.bind(on_press=self.show_points)

        self.layout.add_widget(self.label)
        self.layout.add_widget(btn)
        return self.layout
    
    def show_points(self, instance):
        try:
            points = Functions.sqlConnectionHelper.GetAllPoints()
            if points:
                # Format the display string
                display = '\n'.join([f"{p[0]} - {p[1]} - {p[2]} - {p[3]}" for p in points])
            else:
                display = "No points found."
            self.label.text = display
        except Exception as e:
            self.label.text = f"Error: {e}"

if __name__ == '__main__':
    MyApp().run()