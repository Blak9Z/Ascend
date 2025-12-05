#include <catch2/catch_test_macros.hpp>

#include "ledger.hpp"

using namespace qubic::contracts;

TEST_CASE("progress requires monotonic status and dedupe", "[ledger]") {
    QuestLedger ledger;
    ledger.record_progress("quest", "wallet", 1, 111, 0);
    REQUIRE_THROWS(ledger.record_progress("quest", "wallet", 0, 112, 1));
    REQUIRE_NOTHROW(ledger.record_progress("quest", "wallet", 2, 113, 2));
    REQUIRE_THROWS(ledger.record_progress("quest", "wallet", 2, 113, 3));
}

TEST_CASE("ledger enforces daily xp cap", "[ledger]") {
    QuestLedger ledger;
    auto first = ledger.allocate_xp("quest", "wallet", 400, 0);
    auto second = ledger.allocate_xp("quest", "wallet", 200, 1);
    auto reset = ledger.allocate_xp("quest", "wallet", 100, 86400);

    REQUIRE(first.xp_awarded == 400);
    REQUIRE(second.xp_awarded == 100);
    REQUIRE(reset.xp_awarded == 100);
    REQUIRE(second.total_xp == 500);
}

TEST_CASE("badge metadata required and uniqueness enforced", "[ledger]") {
    QuestLedger ledger;
    ledger.set_badge_metadata("starter", "cid://starter", false);
    auto record = ledger.mint_badge("starter", "wallet", 0, false);
    REQUIRE(record.metadata_cid == "cid://starter");
    REQUIRE_THROWS(ledger.mint_badge("starter", "wallet", 1, false));

    ledger.set_badge_metadata("repeat", "cid://repeat", true);
    REQUIRE_NOTHROW(ledger.mint_badge("repeat", "wallet", 2, false));
    REQUIRE_NOTHROW(ledger.mint_badge("repeat", "wallet", 3, false));
}
