package com.company.salestracker.entity;

public enum LeadStatus {
	NEW {
		@Override
		public boolean canMoveTo(LeadStatus next) {
		
			return next == CONTACTED ;
		}
	},
	CONTACTED {
		@Override
		public boolean canMoveTo(LeadStatus next) {
		
			return next == QUALIFIED||next==LOST ;
		}
	},
	QUALIFIED {
		@Override
		public boolean canMoveTo(LeadStatus next) {
			return false;
		}
	},
	LOST

	{
		@Override
		public boolean canMoveTo(LeadStatus next) {
			return false;
		}
	};

	public abstract boolean canMoveTo(LeadStatus next);
}
