using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading;

namespace ToDoTest {
    [TestClass]
    public class EdgeDriverTest {

        private const string edgeDriverDirectory = @"C:\";
        private const string toDoURL = "https://mikaelaolsson.github.io/assignment3/";
        private EdgeDriver browser;

        [TestInitialize]
        public void EdgeDriverInitialize() {
            browser = new EdgeDriver(edgeDriverDirectory);
            browser.Url = toDoURL;
        }

        [TestMethod]
        public void AddTodoTest() {
            browser.Url = toDoURL;
            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var todo = browser.FindElementByClassName("entry");

            Assert.AreEqual("Hello Jakob", todo.Text);
            Assert.IsTrue(todo.Displayed);
        }

        [TestMethod]
        public void ItemsLeftTest() {
            browser.Url = toDoURL;
            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var count = browser.FindElementById("count");

            Assert.AreEqual("1 item left", count.Text);
            Assert.IsTrue(count.Displayed);

            var toggle = browser.FindElementByClassName("container");
            toggle.Click();

            Assert.AreEqual("0 items left", count.Text);
            Assert.IsTrue(count.Displayed);
        }

        [TestMethod]
        public void TwoItemsLeftTest() {
            browser.Url = toDoURL;
            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            textbox.SendKeys("Bananas are good");
            textbox.SendKeys(Keys.Enter);

            textbox.SendKeys("These are not the droids you are looking for");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var count = browser.FindElementById("count");

            Assert.AreEqual("3 items left", count.Text);
            Assert.IsTrue(count.Displayed);

            var toggles = browser.FindElementsByClassName("container");

            Random rnd = new Random();
            int index = rnd.Next(0, toggles.Count);

            toggles[index].Click();

            Assert.AreEqual("2 items left", count.Text);
            Assert.IsTrue(count.Displayed);
        }

        [TestMethod]
        public void RefreshURLTest() {
            browser.Url = toDoURL;
            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            textbox.SendKeys("These are not the droids you are looking for");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var toggles = browser.FindElementsByClassName("container");
            var todos = browser.FindElementsByClassName("entry");

            Random rnd = new Random();
            int index = rnd.Next(0, toggles.Count);

            toggles[index].Click();

            Assert.AreEqual(2, todos.Count);

            var activeBtn = browser.FindElementById("active");
            activeBtn.Click();

            browser.Navigate().Refresh();
            todos = browser.FindElementsByClassName("entry");

            Assert.AreEqual(1, todos.Count);
            Assert.IsTrue((browser.Url).EndsWith("/#/active"));
        }

        [TestMethod]
        public void BackButtonURLTest() {
            browser.Url = toDoURL;
            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var completedBtn = browser.FindElementById("completed");
            completedBtn.Click();

            var activeBtn = browser.FindElementById("active");
            activeBtn.Click();

            var todos = browser.FindElementsByClassName("entry");
            Assert.AreEqual(1, todos.Count);

            browser.Navigate().Back();
            
            todos = browser.FindElementsByClassName("entry");

            Assert.IsTrue((browser.Url).EndsWith("/#/completed"));
            Assert.AreEqual(0, todos.Count);
        }

        [TestMethod]
        public void EditTest() {
            browser.Url = toDoURL;

            var textbox = browser.FindElementByClassName("new-todo");
            textbox.SendKeys("Hello Jakob");
            textbox.SendKeys(Keys.Enter);

            textbox.SendKeys("Wibbly-Wobbly, Timey-Wimey");
            textbox.SendKeys(Keys.Enter);

            var wait = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            wait.Until(b => browser.FindElementByClassName("entry"));

            var todos = browser.FindElementsByClassName("entry");

            Actions actions = new Actions(browser);
            actions.DoubleClick(todos[1]).Perform();

            var waitAgain = new WebDriverWait(browser, TimeSpan.FromSeconds(5));
            waitAgain.Until(b => browser.FindElementByClassName("edit"));

            var edits = browser.FindElementsByClassName("edit");
            Assert.AreEqual(2, edits.Count);

            edits[1].SendKeys("... Stuff");
            textbox.Click();

            edits = browser.FindElementsByClassName("edit");

            Assert.AreEqual("Wibbly-Wobbly, Timey-Wimey... Stuff", todos[1].Text);
            Assert.AreEqual(2, todos.Count);
            Assert.IsFalse(edits[1].Displayed);
        }
        
        [TestCleanup]
        public void EdgeDriverCleanup() {
            browser.Quit();
        }
    }
}
