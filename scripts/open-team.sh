#!/bin/bash
# Simone Inc. 一键开团：7 个 iTerm 标签，命名好，Dashboard 自动跑

osascript <<'APPLESCRIPT'
tell application "iTerm"
    activate
    set newWindow to (create window with default profile)

    -- Tab 0: Dashboard 自动跑 watch loop
    tell current session of newWindow
        set name to "0·Dashboard"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && while true; do clear; cat docs/team-status.md; sleep 5; done"
    end tell

    -- Tab 1 COO
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "1·COO"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 1·COO ==' && echo '输 claude 然后 paste COO prompt'"
    end tell

    -- Tab 2 PM
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "2·PM"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 2·PM ==' && echo '输 claude 然后 paste PM prompt'"
    end tell

    -- Tab 3 Strategist
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "3·Strategist"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 3·Strategist ==' && echo '输 claude 然后 paste Strategist prompt'"
    end tell

    -- Tab 4 Release Engineer
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "4·Release"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 4·Release ==' && echo '输 claude 然后 paste Release Engineer prompt'"
    end tell

    -- Tab 5 Assistant
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "5·Assistant"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 5·Assistant ==' && echo '输 claude 然后 paste Assistant prompt'"
    end tell

    -- Tab 6 UI/UX Engineer
    tell newWindow to create tab with default profile
    tell current session of newWindow
        set name to "6·UIUX"
        write text "cd /Users/oldfisherman/Desktop/simone && clear && echo '== 6·UIUX ==' && echo '输 claude 然后 paste UI/UX Engineer prompt'"
    end tell

    -- 跳回 Dashboard tab
    tell newWindow
        select first tab
    end tell
end tell
APPLESCRIPT

echo "✅ 7 个标签全开了。Dashboard 在第一个，员工窗口 1-6 在后面。"
echo "切标签：⌘ 1 / ⌘ 2 / ... / ⌘ 7"
