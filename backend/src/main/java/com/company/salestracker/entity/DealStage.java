package com.company.salestracker.entity;

public enum DealStage {

	OPEN {
		public boolean canMoveTo(DealStage next) {
			return next == PROPOSAL_SENT || next == LOST;
		}
	},
	PROPOSAL_SENT {
		public boolean canMoveTo(DealStage next) {
			return next == NEGOTIATION || next == LOST;
		}
	},
	NEGOTIATION {
		public boolean canMoveTo(DealStage next) {
			return next == WON || next == LOST;
		}
	},
	WON {
		public boolean canMoveTo(DealStage next) {
			return false;
		}
	},
	LOST {
		public boolean canMoveTo(DealStage next) {
			return false;
		}
	};

	public abstract boolean canMoveTo(DealStage next);
}
