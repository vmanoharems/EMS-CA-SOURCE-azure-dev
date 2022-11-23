SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[GetCurrentOpenPeriodID]
(
	-- Add the parameters for the function here
	@CompanyID int
	,@Future bit = 0
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ReturnValue int;

	-- Add the T-SQL statements to compute the return value here
	select @ReturnValue=ClosePeriodID from ClosePeriod
	where 
		Status = 'Open'
		and CompanyID = @CompanyID		
		and ((PeriodStatus = 'Current' and @Future = 0) or (PeriodStatus = 'Future' and @Future = 1))
	-- Return the result of the function
	RETURN @ReturnValue

END


GO