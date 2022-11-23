SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[UpdateAdjustment]
(
@AdjustmentID int,
@ADate datetime,
@Amount float,
@Description varchar(500),
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
  if(@Mode=1)
  begin
    update BankAdjustment set Status='Deleted' where AdjustmentID=@AdjustmentID;
  end
 else if(@Mode=2)
  begin
    update BankAdjustment set Date=@ADate where AdjustmentID=@AdjustmentID;
  end
  else if(@Mode=3)
  begin
    update BankAdjustment set Amount=@Amount where AdjustmentID=@AdjustmentID;
  end
  else if(@Mode=4)
  begin
    update BankAdjustment set Description=@Description where AdjustmentID=@AdjustmentID;
  end
  else if(@Mode=5)
  begin
    update BankAdjustment set Status='Cleared' where AdjustmentID=@AdjustmentID;
  end
  else if(@Mode=6)
  begin
     update BankAdjustment set Status='UnCleared' where AdjustmentID=@AdjustmentID;
  end

END



GO